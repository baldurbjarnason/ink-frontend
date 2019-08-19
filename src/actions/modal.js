import Popper from "popper.js";
const FOCUSABLE_ELEMENTS =
  'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])';

function once(emitter, eventName) {
  return new Promise(resolve => {
    function listener(event) {
      resolve(event);
    }
    emitter.addEventListener(eventName, listener, { once: true });
  });
}

let activeModal;
let activeCloser;
const createdModals = {};

export function modal(node, options) {
  let popper;
  let doc;
  let activeElement;

  const closer = (activeCloser = async function closer() {
    activeModal = null;
    activeCloser = null;
    doc.classList.add("is-closing");
    await once(doc, "animationend");
    doc.classList.remove("is-closing");
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("hidden", "true");
    scrollBehaviour("enable");
    node.classList.remove("is-open");
    node.parentElement.classList.remove("js-modal-open");
    for (const child of node.parentElement.children) {
      if (child !== node) {
        if (
          child.hasAttribute("aria-hidden") &&
          child.hasAttribute("data-keep-hidden")
        ) {
          child.removeAttribute("data-keep-hidden");
        } else if (child.hasAttribute("aria-hidden")) {
          child.removeAttribute("aria-hidden");
        }

        if (
          child.hasAttribute("inert") &&
          child.hasAttribute("data-keep-inert")
        ) {
          child.removeAttribute("data-keep-inert");
        } else if (child.hasAttribute("inert")) {
          child.removeAttribute("inert");
        }
      }
    }
    if (popper) {
      popper.destroy();
      popper = null;
    }
    window.requestAnimationFrame(() => {
      if (activeElement) {
        activeElement.focus();
        activeElement = null;
      }
    });
  });

  function onKeydown(event) {
    if (event.keyCode === 27) closer(event);
    if (event.keyCode === 9) maintainFocus(event);
  }

  function onClick(event) {
    if (event.target.dataset.closeModal) {
      closer();
      event.preventDefault();
    }
  }

  node.addEventListener("click", onClick);
  node.addEventListener("keydown", onKeydown);
  node.setAttribute("aria-hidden", "true");
  node.setAttribute("role", "dialog");
  node.setAttribute("hidden", "true");
  node.setAttribute("tabIndex", "-1");
  node.classList.add("what-a-modal");
  const name = node.id.toLowerCase();
  // const modalId = name + "-modal";
  const docId = name + "-document";

  function scrollBehaviour(toggle) {
    const body = document.querySelector("body");
    switch (toggle) {
      case "enable":
        Object.assign(body.style, { overflow: "", height: "" });
        break;
      case "disable":
        Object.assign(body.style, { overflow: "hidden", height: "100vh" });
        break;
      default:
    }
  }
  function maintainFocus(event) {
    const focusableNodes = Array.from(
      node.querySelectorAll(FOCUSABLE_ELEMENTS)
    );
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    if (focusedItemIndex === -1) {
      focusableNodes[0].focus();
      event.preventDefault();
    } else {
      if (event.shiftKey && focusedItemIndex === 0) {
        focusableNodes[focusableNodes.length - 1].focus();
        event.preventDefault();
      }

      if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
        focusableNodes[0].focus();
        event.preventDefault();
      }
    }
  }

  async function open(props) {
    await activeCloser();
    const heading = node.querySelector("h1, h2, h3, h4, h5, h6");
    doc = document.getElementById(docId);
    if (doc && !doc.hasAttribute("role")) {
      doc.setAttribute("role", "document");
    }
    const autofocus =
      node.querySelector("[autofocus]") ||
      node.querySelector("[data-autofocus]");
    let focusTarget;
    if (autofocus) {
      focusTarget = autofocus;
    } else {
      focusTarget = node;
    }
    if (props.label) {
      node.setAttribute("aria-label", props.label);
    } else if (heading) {
      heading.id = node.id + "-heading";
      node.setAttribute("aria-labelledby", heading.id);
      if (heading.hasAttribute("data-autofocus")) {
        heading.tabIndex = "-1";
      }
    }
    for (const child of node.parentElement.children) {
      if (child !== node) {
        if (child.hasAttribute("aria-hidden")) {
          child.setAttribute(
            "data-keep-hidden",
            child.getAttribute("aria-hidden")
          );
        }

        if (child.hasAttribute("inert")) {
          child.setAttribute("data-keep-inert", child.getAttribute("inert"));
        }
        child.setAttribute("inert", "true");
        child.setAttribute("aria-hidden", "true");
      }
    }
    if (props.caller) {
      popper = new Popper(props.caller, doc, {
        // positionFixed: true,
        arrow: { enabled: true }
      });
    }
    activeElement = document.activeElement;
    scrollBehaviour("disable");
    node.setAttribute("aria-hidden", "false");
    node.removeAttribute("hidden");
    doc.classList.add("is-opening");
    await once(doc, "animationend");
    doc.classList.remove("is-opening");
    node.classList.add("is-open");
    activeModal = node;
    node.parentElement.classList.add("js-modal-open");
    window.requestAnimationFrame(() => {
      focusTarget.focus();
    });
    createdModals[node.id] = open;
  }
  return {
    destroy() {
      node.removeEventListener("click", onClick);
      node.removeEventListener("keydown", onKeydown);
      delete createdModals[node.id];
    }
  };
}

// <node action:modal />
// opened using imported opener
// rendered separately
// Node needs to be a sibling to the root

document.body.addEventListener("click", event => {
  if (activeModal && !activeModal.contains(event.target)) {
    activeCloser();
  }
});
export function opener(id, props) {
  createdModals[id](props);
}
export function closer() {
  return Promise.resolve().then(() => {
    if (activeCloser) {
      return activeCloser();
    }
  });
}
