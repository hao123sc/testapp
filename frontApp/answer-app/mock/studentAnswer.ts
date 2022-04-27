import { json, Request, Response } from 'express';
import mockjs from 'mockjs'



 
const getStudentAnswer = (req: Request, res: Response) => {
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
            'answerText':'@string(20)',
            'userScore':0,
            'autoScore':0,
            'grade':/(高一)|(高二)|(高三)/,
            'vclass|1':[1,2,3,4,5,6,7,8,9],
            'values|1-10':1,
            'studentName':'@cname',
            'studentId|+1':20222001,
            'lesson|1':['语文','数学','外语','物理','化学','生物','政治','历史','地理'],
            'subjectText':'@string(20)',
            'standText':'@string(20)',
        }]
    })

    return res.json(data)

}

export default {
    'GET /api/studentAnswer': getStudentAnswer,
}