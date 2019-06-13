import fs from "fs"
import NuxtConfiguration from "@nuxt/config"

const config: NuxtConfiguration = {
  mode: "universal",

  head: {
    title: "romeogame",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Play with romeogame" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    // script: [
    //   { src: "https://unpkg.com/@tensorflow/tfjs", type: "text/javascript" },
    //   { src: "https://unpkg.com/@tensorflow-models/posenet", type: "text/javascript" }
    // ]
  },

  loading: { color: "#fff" },

  css: ["~/assets/css/tailwind.css"],

  plugins: [],

  modules: ["@nuxtjs/pwa", "nuxt-fontawesome"],

  fontawesome: {
    component: "fa",
    imports: [
      {
        set: "@fortawesome/pro-light-svg-icons",
        icons: ["faBlind"]
      },
      {
        set: "@fortawesome/pro-regular-svg-icons",
        icons: ["faWebcam", "faWebcamSlash"]
      },
      {
        set: "@fortawesome/pro-solid-svg-icons",
        icons: ["faWalking"]
      }
    ]
  },

  build: {
    postcss: {
      plugins: [require("tailwindcss")("./tailwind.config.ts"), require("autoprefixer")]
    },
    loaders: {
      cssModules: {
        localIdentName: "[name]__[local]__[hash:base64:5]"
      }
    }
  }
}

if (process.env.NODE_ENV === "development") {
  const keyFile = "/etc/ssl/private/ssl-cert-snakeoil.key"
  const certFile = "/etc/ssl/certs/ssl-cert-snakeoil.pem"
  let setHttps = true

  try {
    fs.accessSync(keyFile, fs.constants.R_OK)
    fs.accessSync(certFile, fs.constants.R_OK)
  } catch (err) {
    console.log("No cert access, no https.")
    setHttps = false
  }

  if (setHttps) {
    config.server = {
      https: {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
      }
    }
  }
}

export default config
