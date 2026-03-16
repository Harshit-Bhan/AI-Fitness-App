import { Context } from "koa"
import { analyseImage } from "../services/gemini";


export default {
    async analyse(ctx: Context){
        const file = ctx.request.files?.image as any;
        if(!file) return ctx.badRequest('No image uploaded')

        const filePath = file.filepath;

        try{
            const result = await analyseImage(filePath)
            return ctx.send({success: true, result})
        } catch (error) {
            ctx.internalServerError("Analysis failed",{error: error.message})
        }
    }
}