

export default {
    routes:[
        {
            method: "POST",
            path: "/image-analysis",
            handler: "image-analysis.analyse",
            config: { auth: false },
        }
    ]
}