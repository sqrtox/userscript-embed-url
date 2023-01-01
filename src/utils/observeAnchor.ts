import { findElement } from './findElement';

export const ObserveAnchorRecordTypes = {
  Found: 'found',
  Added: 'added',
  Removed: 'removed',
  Appeared: 'appeared',
  Disappeared: 'disappeared',
  Changed: 'changed'
} as const;

export type ObserveAnchorRecordTypes = typeof ObserveAnchorRecordTypes;
export type ObserveAnchorRecordType = ObserveAnchorRecordTypes[keyof ObserveAnchorRecordTypes];

type ObserveAnchorRecord = Readonly<{
  type: ObserveAnchorRecordType,
  targets: readonly HTMLAnchorElement[]
}>;

type ObserveAnchorCallback = (records: readonly ObserveAnchorRecord[]) => void;

type ObserveAnchorOptions = Readonly<Partial<{
  filter: readonly ObserveAnchorRecordType[],
  signal: AbortSignal
}>>;

type ObserveAnchorRecordsCreator = () => IterableIterator<ObserveAnchorRecord>

export const observeAnchor = (
  callback: ObserveAnchorCallback,
  {
    filter,
    signal
  }: ObserveAnchorOptions = {}
): void => {
  signal?.addEventListener('abort', () => {
    intersectionObserver?.disconnect();
    intersectionObserver = undefined;
    mutationObserver?.disconnect();
    mutationObserver = undefined;
  }, { once: true });

  const filterSet = filter && new Set(filter);
  const flush = (creator: ObserveAnchorRecordsCreator): void => {
    const records: ObserveAnchorRecord[] = [];

    for (const record of creator()) {
      if (!record.targets.length) {
        continue;
      }

      if (filterSet && !filterSet.has(record.type)) {
        continue;
      }

      records.push(record);
    }

    if (!records.length) {
      return;
    }

    callback(records);
  };

  let intersectionObserver: IntersectionObserver | undefined = new IntersectionObserver(records => {
    flush(function* () {
      const appearedTargets: HTMLAnchorElement[] = [];
      const disappearedTargets: HTMLAnchorElement[] = [];

      for (const { isIntersecting, target } of records) {
        if (!(target instanceof HTMLAnchorElement)) {
          continue;
        }

        if (isIntersecting) {
          appearedTargets.push(target);
        } else {
          disappearedTargets.push(target);
        }
      }

      yield {
        type: ObserveAnchorRecordTypes.Appeared,
        targets: appearedTargets
      };

      yield {
        type: ObserveAnchorRecordTypes.Disappeared,
        targets: disappearedTargets
      };
    });
  });

  let mutationObserver: MutationObserver | undefined = new MutationObserver(records => {
    flush(function* () {
      const changedTargets: HTMLAnchorElement[] = [];
      const addedTargets: HTMLAnchorElement[] = [];
      const removedTargets: HTMLAnchorElement[] = [];

      for (const {
        type,
        target,
        addedNodes,
        removedNodes,
        attributeName,
        oldValue
      } of records) {
        switch (type) {
          case 'attributes': {
            if (!(target instanceof HTMLAnchorElement)) {
              break;
            }

            if (attributeName !== 'href') {
              break;
            }

            if (target.href === oldValue) {
              break;
            }

            changedTargets.push(target);

            break;
          }

          case 'childList': {
            for (const n of addedNodes) {
              if (!(n instanceof Element)) {
                continue;
              }

              for (const e of findElement('a', n)) {
                addedTargets.push(e);
                intersectionObserver?.observe(e);
              }
            }

            for (const n of removedNodes) {
              if (!(n instanceof Element)) {
                continue;
              }

              for (const e of findElement('a', n)) {
                removedTargets.push(e);
                intersectionObserver?.unobserve(e);
              }
            }

            break;
          }
        }
      }

      yield {
        type: ObserveAnchorRecordTypes.Changed,
        targets: changedTargets
      };

      yield {
        type: ObserveAnchorRecordTypes.Added,
        targets: addedTargets
      };

      yield {
        type: ObserveAnchorRecordTypes.Removed,
        targets: removedTargets
      };
    });
  });

  mutationObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['href']
  });

  flush(function* () {
    const targets: HTMLAnchorElement[] = [];

    for (const e of findElement('a')) {
      targets.push(e);
      intersectionObserver?.observe(e);
    }

    yield {
      type: ObserveAnchorRecordTypes.Found,
      targets
    };
  });
};
