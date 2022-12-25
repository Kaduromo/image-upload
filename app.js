import { initializeApp } from "firebase/app"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  listAll,
} from "firebase/storage"
import { upload } from "./upload"
import "./css/main.scss"
//========================================================================================================================================================

const firebaseConfig = {
  apiKey: "AIzaSyD2THrTCZ47EGar-5BgHuImpHmpJyf7n1Q",
  authDomain: "my-image-loader.firebaseapp.com",
  projectId: "my-image-loader",
  storageBucket: "my-image-loader.appspot.com",
  messagingSenderId: "745630323189",
  appId: "1:745630323189:web:335d52d91f97f4c27950bc",
}
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", ".gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + "%"
          const block = blocks[index].querySelector(".preview__progress")
          block.textContent = percentage
          block.style.width = percentage
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL)
          })
        }
      )
    })
  },
})

const ImageRef = ref(storage, "images/")

listAll(ImageRef).then((response) => {
  console.log(response)

  response.items.forEach((item) => {
    console.log(item)
    getDownloadURL(item).then((url) => console.log(url))
  })

  const card = document.querySelector(".card")
  const block = document.createElement("div")
  block.className = "images"
  const blockBody = document.createElement("div")
  blockBody.className = "images__body"

  block.append(blockBody)
  response.items.forEach((item) => {
    getDownloadURL(item).then((url) => {
      blockBody.insertAdjacentHTML(
        "afterbegin",
        `<div><img src="${url}" alt="${url}" /></div>`
      )

      card.append(block)
    })
  })
})
