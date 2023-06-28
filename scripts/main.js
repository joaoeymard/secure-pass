"use strict";
const storageSecrets = new Storage({
  st: localStorage,
  key: "sct",
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
    const $auto_secret_lenght = $form.querySelector(
      "input[name=auto_secret_lenght]"
    );
    const $limit_view_secret_sec = $form.querySelector(
      "input[name=limit_view_secret_sec]"
    );

    return {
      hash: $hash.value,
      auto_secret_lenght: parseInt($auto_secret_lenght.value),
      limit_view_secret_sec: parseInt($limit_view_secret_sec.value),
    };
  },
};

const getFileReader = (file) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
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

  window.exportFromJSON({ data, fileName: "securepass", exportType: "json" });
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
const encrypted = (str, hash) =>
  CryptoJS.AES.encrypt(str, hash || storageConfig.find().hash).toString();
const decrypted = (str, hash) =>
  CryptoJS.AES.decrypt(str, hash || storageConfig.find().hash).toString(
    CryptoJS.enc.Utf8
  );
