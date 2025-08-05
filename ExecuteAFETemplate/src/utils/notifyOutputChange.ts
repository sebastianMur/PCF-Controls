type NotifyFn = () => void;

let notifyFn: NotifyFn = () => {};

export function setNotifyOutputChange(fn: NotifyFn) {
  notifyFn = fn;
}

export function triggerNotifyOutputChange() {
  notifyFn();
}
