import { type Object } from 'ts-toolbelt';
import { objectKeys } from './objectKeys';
import { observeAnchor, ObserveAnchorRecordTypes } from './observeAnchor';
import { findElement } from './findElement';

export type AnchorEmbedRuleTest = AnchorEmbedRule['test']

export type AnchorEmbedRuleTestMethod = 'every' | 'some'

export type AnchorEmbedRuleEffectContext = Readonly<{
  target: HTMLAnchorElement,
  anchorEmbed: AnchorEmbed,
  url: URL,
  rule: AnchorEmbedRule,
  onAbort: (listener: () => void) => void
}>;

export type AnchorEmbedRuleEffect = (ctx: AnchorEmbedRuleEffectContext) => void;

export type AnchorEmbedFilter = Readonly<{
  test: RegExp | readonly RegExp[]
} | {
  testMethod?: AnchorEmbedRuleTestMethod
  test: Partial<Record<
    Object.FilterKeys<URL, Exclude<URL[keyof URL], string>>,
    RegExp | readonly RegExp[]
  >>
}>

export type AnchorEmbedRule = AnchorEmbedFilter & Readonly<{
  name: string,
  effect: AnchorEmbedRuleEffect
}>;

export type AnchorEmbedResolverEffect = (url: URL) => URL | undefined;

export type AnchorEmbedResolver = AnchorEmbedFilter & Readonly<{
  name: string,
  effect: AnchorEmbedResolverEffect
}>;

export type AnchorEmbedOptions = Readonly<{
  rules: readonly AnchorEmbedRule[],
  resolvers?: readonly AnchorEmbedResolver[]
}>

export class AnchorEmbed {
  readonly ['constructor'] = AnchorEmbed;
  readonly #rules: readonly AnchorEmbedRule[];
  readonly #resolvers: readonly AnchorEmbedResolver[];

  constructor({
    rules,
    resolvers = []
  }: AnchorEmbedOptions) {
    this.#rules = rules;
    this.#resolvers = resolvers;
  }

  readonly #excludes = new WeakSet<HTMLAnchorElement>();

  exclude(target: HTMLAnchorElement): void {
    this.#excludes.add(target);
  }

  include(target: HTMLAnchorElement): void {
    this.#excludes.delete(target);
  }

  readonly #abortControllersMap = new WeakMap<HTMLAnchorElement, Set<AbortController>>();

  #createAbortController(target: HTMLAnchorElement): AbortController {
    const controller = new AbortController();
    const controllersMap = this.#abortControllersMap;
    const controllers = controllersMap.get(target) ?? new Set();

    if (!controllersMap.has(target)) {
      controllersMap.set(target, controllers);
    }

    controllers.add(controller);

    return controller;
  }

  #resolve(url: URL): URL {
    const resolvers = this.#resolvers.filter(v => (
      this.constructor.#testFilter(url, v)
    ));

    if (!resolvers.length) {
      return url;
    }

    let current = resolvers[0].effect(url) ?? url;
    const len = resolvers.length;

    for (let i = 1; i < len; i++) {
      const resolved = resolvers[i].effect(current);

      if (resolved) {
        current = resolved;
      }
    }

    return current;
  }

  readonly #appliedRulesMap = new WeakMap<HTMLAnchorElement, Set<AnchorEmbedRule>>;

  #isAppliedRule(target: HTMLAnchorElement, rule: AnchorEmbedRule): boolean {
    const appliedRules = this.#appliedRulesMap.get(target);

    if (!appliedRules) {
      return false;
    }

    return appliedRules.has(rule);
  }

  applyRule(target: HTMLAnchorElement, asHref = target.href): void {
    if (this.#excludes.has(target)) {
      return;
    }

    if (!asHref) {
      return;
    }

    const url = this.#resolve(new URL(asHref));
    const appliedRulesMap = this.#appliedRulesMap;

    for (const rule of this.#rules) {
      if (!this.constructor.#testFilter(url, rule)) {
        continue;
      }

      if (this.#isAppliedRule(target, rule)) {
        continue;
      }

      rule.effect({
        anchorEmbed: this,
        rule,
        url,
        target,
        onAbort: listener => {
          const { signal } = this.#createAbortController(target);

          signal.addEventListener('abort', () => listener());
        }
      });

      const appliedRules = appliedRulesMap.get(target) ?? new Set();

      if (!appliedRulesMap.has(target)) {
        appliedRulesMap.set(target, appliedRules);
      }

      appliedRules.add(rule);
    }
  }

  destroyRule(target: HTMLAnchorElement): void {
    const abortControllersMap = this.#abortControllersMap;
    const controllers = abortControllersMap.get(target);

    if (controllers) {
      for (const controller of controllers) {
        controller.abort();
        controllers.delete(controller);
      }

      if (!controllers.size) {
        abortControllersMap.delete(target);
      }
    }

    this.#appliedRulesMap.delete(target);
  }

  #observeAnchorController?: AbortController;

  apply(): void {
    const observeAnchorController = this.#observeAnchorController = new AbortController();

    observeAnchor(records => {
      for (const { type, targets } of records) {
        for (const target of targets) {
          switch (type) {
            case ObserveAnchorRecordTypes.Appeared: {
              this.applyRule(target);

              break;
            }

            case ObserveAnchorRecordTypes.Changed: {
              this.destroyRule(target);
              this.applyRule(target);

              break;
            }

            case ObserveAnchorRecordTypes.Removed: {
              this.destroyRule(target);

              break;
            }
          }
        }
      }
    }, {
      signal: observeAnchorController.signal,
      filter: [
        ObserveAnchorRecordTypes.Appeared,
        ObserveAnchorRecordTypes.Changed,
        ObserveAnchorRecordTypes.Removed
      ]
    });
  }

  destroy(): void {
    for (const e of findElement('a')) {
      this.destroyRule(e);
    }

    this.#observeAnchorController?.abort();
    this.#observeAnchorController = undefined;
  }

  static #testFilter(url: URL, filter: AnchorEmbedFilter): boolean {
    const { test } = filter;

    if (test instanceof RegExp) {
      return test.test(url.href);
    }

    if (test instanceof Array) {
      return test.length ? test.some(v => v.test(url.href)) : false;
    }

    const testMethod = 'testMethod' in filter && filter.testMethod || 'every';
    const keys = objectKeys(test);

    if (!keys.length) {
      return false;
    }

    return keys[testMethod](k => {
      const r = test[k];

      if (!r) {
        return false;
      }

      if (r instanceof RegExp) {
        return r.test(url[k]);
      }

      return r.length ? r.some(v => v.test(url[k])) : false;
    });
  }
}
