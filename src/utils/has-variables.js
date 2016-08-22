export function hasVariables(text) {
  if(!text)
    return false;

  // 내부 속성용 변수 표현이 있는 지 확인한다.
  if(text.search(/#{(\S*)}/) !== -1)
    return true;

  // 변수용 변수 표현이 있는 지 확인한다.
  if(text.search(/\${[^}]*}/) !== -1)
    return true;

  return false;
}
