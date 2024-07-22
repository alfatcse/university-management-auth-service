import supertest from 'supertest';
import app from '../../app';
export const CreateStudent = async (student: any) => {
  try {
    const data = {
      student
    };
    const response = await supertest(app).post(`/api/v1/users/create-student`).send(data.student);
    return response;
  } catch (error) {
    throw new Error(`Failed to create Student: ${error}`);
  }
};
export const DeleteStudent = async (id: string) => {
  try {
    const response = await supertest(app).delete(`/api/v1/students/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to delete Student: ${error}`);
  }
};
export const GetAllStudent=async()=>{
    try{
        const response=await supertest(app).get(`/api/v1/students`);
        return response;
    }catch(error){
        throw new Error(`Failed to get all Student: ${error}`);
    }
}
export const getSingleStudent=async(id:string)=>{
    try{
        console.log(id)
        const response=await supertest(app).get(`/api/v1/students/${id}`);
        return response;
    }catch(error){
        throw new Error(`Failed to get single Student: ${error}`);
    }
}
