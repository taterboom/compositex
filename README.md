;(function () {
/\*_ @type {CompositeX.MetaNodeConfig} _/
const nodeConfig = {
config: {
name: "Osstest",
desc: "osstest",
input: {
type: "string",
default: "https://api.tinify.com/output/975hgpcarxdt21jadmc38rby12px6vq7",
},
output: { type: "string" },
options: [{ name: "service", type: "string", default: "cms_comment_image" }],
},
run(input, options, context) {
return context
.fetch(input)
.then((res) => {
console.log(res)
return new File([res], "??.png", { type: res.type })
})
.then((file) => context.alioss({ file, service: options.service }))
},
}
return nodeConfig
})()
