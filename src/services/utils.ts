import { useContext } from "react";
import { AppContext } from "../app.context";

export function cloneObject(input: any): any {
  return JSON.parse(JSON.stringify(input));
}

export function generateRandomStr (length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

export function generateId () {
  return generateRandomStr(30);
}

export function getParameterByName(name: string, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


export function formatDate(text: string) {
  const date = new Date(text);
  const temp = date.toLocaleString({} as any, { month: 'short', day: 'numeric', year: 'numeric' });
  const fragments = temp.split(' ').map(x => x.replace(',', ''));
  const result = fragments[0] + ' ' + fragments[1] +
      (fragments[1].endsWith('1') ? 'st' :
          fragments[1].endsWith('2') ? 'nd' :
              fragments[1].endsWith('3') ? 'rd' : 'th')
      + ', ' + fragments[2];
  return result;
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}