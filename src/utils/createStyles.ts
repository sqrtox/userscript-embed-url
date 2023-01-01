import { paramCase } from 'change-case';
import { objectKeys } from '~/utils/objectKeys';

const s = document.createElement('style');

document.head.append(s);

export type Style = Partial<CSSStyleDeclaration>
export type Styles = Readonly<Record<string, Style>>;
export type StylesList<K extends string> = Readonly<Record<K, Styles>>

export const randomClassName = (): string => `css-${Math.random().toString(36).slice(2)}`;

export const createStyles = <K extends string>(stylesList: StylesList<K>): Readonly<Record<K, string>> => {
  const classNames = {} as Record<K, string>;
  let css = '';

  for (const k of objectKeys(stylesList)) {
    const className = classNames[k] = randomClassName();
    const styles = stylesList[k];

    for (const k in styles) {
      css += `.${className}${k}{`;

      const style = styles[k];

      for (const k in style) {
        css += `${paramCase(k)}:${style[k]};`;
      }

      css += '}';
    }
  }

  s.innerHTML += css;

  return classNames;
};


