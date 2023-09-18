import { RedisClint } from '../../../shared/redis';
import { EVENT_ACADEMIC_SEMESTER_CREATED } from './academicSemester.constant';

const InitAcademicSemesterEvents = () => {
  RedisClint.subscribe(EVENT_ACADEMIC_SEMESTER_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    // eslint-disable-next-line no-console
    console.log(data);
  });
};
export default InitAcademicSemesterEvents;
