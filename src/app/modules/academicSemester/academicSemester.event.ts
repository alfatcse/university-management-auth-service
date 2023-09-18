import { RedisClint } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_UPDATED,
} from './academicSemester.constant';
import { IAcademicSemesterCreatedEvent } from './academicSemester.interface';
import { AcademicSemesterService } from './academicSemester.service';

const InitAcademicSemesterEvents = () => {
  RedisClint.subscribe(EVENT_ACADEMIC_SEMESTER_CREATED, async (e: string) => {
    const data: IAcademicSemesterCreatedEvent = JSON.parse(e);
    await AcademicSemesterService.createSemesterFromEvent(data);
    // eslint-disable-next-line no-console
    console.log(data);
  });
  RedisClint.subscribe(EVENT_ACADEMIC_SEMESTER_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    await AcademicSemesterService.updateOneIntoDBFromEvent(data);
    // eslint-disable-next-line no-console
    console.log('Updated Data', data);
  });
};
export default InitAcademicSemesterEvents;
