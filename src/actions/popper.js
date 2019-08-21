import Popper from "popper.js";


export function popper (node, options) {
  console.log(options)
  const popper = new Popper(options.ref, node, {
    arrow: { enabled: options.arrow }
  });
  return {
    destroy () {
      popper.destroy();
    }
  }
}