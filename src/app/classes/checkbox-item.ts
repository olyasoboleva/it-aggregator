export class CheckboxItem {
  value: string;
  checked: boolean;

  constructor(value: string, checked?: boolean) {
    this.value = value;
    this.checked = checked ? checked : false;
  }
}
