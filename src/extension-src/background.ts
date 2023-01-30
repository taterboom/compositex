console.log("?", window?.location)

fetch("https://apiv3.shanbay.com/bayuser/user")
  .then((res) => res.json())
  .then(console.log)

export default { name: 123 }
