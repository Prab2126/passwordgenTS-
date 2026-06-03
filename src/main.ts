interface ITimerInfo {
  renderPass: number | undefined;
  rangeVal: number | undefined;
}
interface ICharValue {
  upperCase: string;
  lowerCase: string;
  number: string;
  symbols: string;
}
type TTypes = {
  upperCase: boolean;
  lowerCase: boolean;
  number: boolean;
  symbols: boolean;
};
type TSpecificChar = { key: string; bool: boolean };

const finalPassActions: HTMLElement | null =
  document.querySelector("#finalPass");
const passText = document.getElementById(
  "password",
) as HTMLParagraphElement | null;
const incDec: HTMLDivElement | null = document.querySelector("#increaser");
const lengthView: HTMLLabelElement | null =
  document.querySelector("#lengthView strong");
const inputRange: HTMLInputElement | null =
  document.querySelector("#passRange");
const charSetter: HTMLDivElement | null = document.querySelector("#charSetter");
const levelOfPass: HTMLElement | null = document.querySelector("#passLevel");
const defaultTypes: TTypes = {
  upperCase: true,
  lowerCase: true,
  number: true,
  symbols: false,
};

let length = 8;
const timerId: ITimerInfo = {
  renderPass: undefined,
  rangeVal: undefined,
};
function updateTypeOfPass(): void {
  if (levelOfPass != null) {
    levelOfPass.classList.forEach((value: string): void => {
      levelOfPass.classList.remove(value);
    });
    if (length < 8) {
      levelOfPass.textContent = "Very Weak";
      levelOfPass.classList.add("weak");
    } else if (length >= 8 && length <= 12) {
      levelOfPass.textContent = "Medium";
      levelOfPass.classList.add("medium");
    } else if (length >= 13 && length <= 20) {
      levelOfPass.textContent = "Strong";
      levelOfPass.classList.add("strong");
    } else {
      levelOfPass.textContent = "Very Strong";
      levelOfPass.classList.add("veryStrong");
    }
  }
}
function randomPass(charType: TTypes, length: number): string {
  if (length) {
    let pass = "";
    const charTypes: ICharValue = {
      number: "1234567890",
      upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowerCase: "abcdefghijklmnopqrstuvwxyz",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
    const kv: [string, boolean][] = Object.entries(charType);
    const obj = kv
      .filter(([_, bool]: [string, boolean]): boolean => bool)
      .map(
        ([key, bool]: [string, boolean]): TSpecificChar => ({
          key,
          bool,
        }),
      );
    const totalChar: TTypes = { ...charType };
    const iLength: number = obj.length;
    let totalTruthCount: number = 0;
    for (let i: number = 1; i <= length; i++) {
      for (const key in totalChar) {
        const isPositive = totalChar[key as keyof TTypes];
        if (isPositive) totalTruthCount++;
      }
      const getRemainingTruth: number = iLength - totalTruthCount;
      const getRemaining: number = length - pass.length;
      const index: number = Math.floor(Math.random() * iLength);
      const { key }: TSpecificChar = obj[index];

      const charTypeVal: string = charTypes[key as keyof TTypes];
      if (totalChar[key as keyof TTypes] == false)
        totalChar[key as keyof TTypes] = true;
      if (getRemaining === getRemainingTruth && getRemaining > 1) {
        for (const key in charType) {
          const isTrue = charType[key as keyof TTypes];
          if (isTrue) {
            delete charType[key as keyof TTypes];
          }
        }
      }
      const charTypeIndex = Math.floor(Math.random() * charTypeVal.length);
      pass += charTypeVal[charTypeIndex];
      totalTruthCount = 0;
    }
    return pass;
  }
  return "";
}

function renderOnRefresh(length: number) {
  if (passText != null) {
    const password: string = randomPass(defaultTypes, length);
    const prevPass: string = passText.textContent;
    let i: number = 0;
    if (timerId.renderPass != null) {
      clearInterval(timerId.renderPass);
    }
    timerId.renderPass = setInterval(() => {
      if (i >= length - 1) clearInterval(timerId.renderPass);
      passText.textContent =
        password.slice(0, i) + password[i] + prevPass.slice(i + 1, length - 1);
      i++;
    }, 40);
  }
}
renderOnRefresh(length);
finalPassActions?.addEventListener("click", ({ target }): void => {
  if (
    (target instanceof HTMLElement &&
      target.parentElement instanceof HTMLButtonElement) ||
    target instanceof HTMLButtonElement
  ) {
    const action: string | undefined = (
      target.tagName.toLowerCase() === "button"
        ? target
        : (target.parentElement as HTMLButtonElement)
    ).dataset.action;
    if (action != null) {
      switch (action) {
        case "update": {
          renderOnRefresh(length);
          break;
        }
        case "copy": {
          if (passText != null) {
            navigator.clipboard.writeText(passText.textContent);
            alert("Password copied");
          }
          break;
        }
      }
    }
  }
});
incDec?.addEventListener("click", ({ target }): void => {
  if (
    target instanceof HTMLButtonElement &&
    inputRange != null &&
    lengthView != null
  ) {
    const action: string | undefined = target.dataset.action;
    if (timerId.rangeVal != null) clearTimeout(timerId.rangeVal);
    timerId.rangeVal = setTimeout(() => {
      if (action != null) {
        const isIncrease: boolean = action === "increase";
        const rangeVal: number = Number(inputRange.value);
        const value: number = isIncrease ? rangeVal + 1 : rangeVal - 1;
        if (value != 0 && value <= 50) {
          inputRange.value = String(value);
          length = value;
          lengthView.textContent = String(value);
          renderOnRefresh(length);
          updateTypeOfPass();
        }
      }
    }, 100);
  }
});
inputRange?.addEventListener("input", ({ target }): void => {
  if (target instanceof HTMLInputElement && lengthView != null) {
    if (timerId.rangeVal != null) clearTimeout(timerId.rangeVal);
    timerId.rangeVal = setTimeout(() => {
      const value = Number(target.value);
      lengthView.textContent = String(value);
      length = value;
      renderOnRefresh(length);
      updateTypeOfPass();
    }, 500);
  }
});
charSetter?.addEventListener("click", ({ target }): void => {
  if (target instanceof HTMLInputElement) {
    const charAction = target.dataset.chartype as keyof TTypes | undefined;
    const isChecked: boolean = target.checked;
    if (charAction != null) {
      console.log(target);
      defaultTypes[charAction] = isChecked;
      renderOnRefresh(length);
    }
  }
});
