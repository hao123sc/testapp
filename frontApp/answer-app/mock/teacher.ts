import { json, Request, Response } from 'express';
import mockjs from 'mockjs'



 
const getTeacher = (req: Request, res: Response) => {
    const { current= 1, pageSize = 10 } = req.query;

    const keyWord = req['keyWord']

    mockjs.Random.string('lower',8)
    mockjs.Random.word(8)
    let data = mockjs.mock({
        
        current:current,
        pageSize:pageSize,
        keyWord:keyWord,
        success:true,
        total:100,
        'data|20':[{
            'id|+1':1+((current as number)-1)*(pageSize as number),
            'loginName|+1':function(){return 'teacher'+this.id},
            'password|+1':function(){return 'teacher'+this.id},
            'name':'@cname',
            'teacherId|+1':202020+((current as number)-1)*(pageSize as number),
            'course|1':['语文','数学','外语','物理','化学','生物','政治','历史','地理'],
            'teacherOfClass|+1':/(高一[1-9]班)|(高二[1-9]班)|(高三[1-9]班)/,
        }]
    })

    return res.json(data)

}

export default {
    'GET /api/teacher': getTeacher,
}