"use strict";
const storageSecrets = new Storage({
  st: localStorage,
  key: "sct",
  onChange: (strg) => (v.secrets = strg.data),
});
const storageConfig = new Storage({
  st: localStorage,
  key: "cfg",
});

const serialize = {
  formSecretDetails: () => {
    const $form = document.querySelector("#mdl-secret-details form");
    const $title = $form.querySelector("input[name=title]");
    const $tags = $form.querySelector("input[name=tags]");
    const $link = $form.querySelector("input[name=link]");
    const $secret = $form.querySelector("textarea[name=secret]");

    return {
      title: $title.value,
      tags: $tags.value,
      link: $link.value,
      secret: encrypted($secret.value),
    };
  },
  formConfig: () => {
    const $form = document.querySelector("#mdl-config form");
    const $hash = $form.querySelector("input[name=hash]");

    return {
      hash: $hash.value,
    };
  },
};

const getFileReader = (file) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      // reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });

function exportData() {
  const dataStr = JSON.stringify(storageSecrets.filter());
  const data = {
    ...storageConfig.find(),
    data: encrypted(dataStr),
  };

  window.exportFromJSON({ data, fileName: "segurepass", exportType: "json" });
}

// Funções uteis
const randomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const uuid = (a) =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
const randPassword = (len) =>
  Array(len)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map((x) => x[Math.floor(Math.random() * x.length)])
    .join("");

// Funções de criptografia
const encrypted = (str) =>
  CryptoJS.AES.encrypt(str, storageConfig.find().hash).toString();
const decrypted = (str) =>
  CryptoJS.AES.decrypt(str, storageConfig.find().hash).toString(
    CryptoJS.enc.Utf8
  );
