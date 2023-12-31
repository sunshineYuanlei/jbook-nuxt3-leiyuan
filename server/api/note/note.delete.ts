/**
 * 1、判断用户是否登录
 * 2、已登录则删除文章
 */

import Joi from "joi";
import {getDB} from "~/server/utils/db/mysql";
import {getLoginUid, responseJson} from "~/server/utils/helper";


export default defineEventHandler(async (event)=>{
    //判断用户登录
    let uid = getLoginUid(event)
    console.log('uid',uid)
    if (uid === 0) {
        // @ts-ignore
        setResponseStatus(event,401)
        return responseJson(1,'请先登录',{})
    }
    //获取数据
    const body = await readBody(event)
    console.log('11111',body)

    //校验数据joi
    const schema = Joi.object({
        noteId: Joi.number().required()
    });
    try {
        const value = await schema.validateAsync(body);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }


    const con = getDB()
    try {
        //删除文章
        const [rows] = await con.execute('DELETE FROM `notes` WHERE `id`=? AND `uid`=?',
            [body.noteId,uid]);
        console.log('333333',rows)
        //释放连接
        await con.end()
        if (rows.affectedRows === 0){
            return  responseJson(1,'删除文章失败',{})
        }
        return  responseJson(0,'删除文章成功',{})
    }catch (e){
        //释放连接
        await con.end()
        console.log('error',e)
        // @ts-ignore
        setResponseStatus(event,500)
        return responseJson(1,'服务器错误',{})
    }


})
