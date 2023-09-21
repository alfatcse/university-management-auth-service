import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_DEPARTMENT_CREATED } from './academicDepartment.constants';
import { IAcademicDepartmentCreatedEvent } from './academicDepartment.interfaces';
import { AcademicDepartmentService } from './academicDepartment.service';

const initAcademicDepartmentEvents = () => {
  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_CREATED,
    async (e: string) => {
      const data: IAcademicDepartmentCreatedEvent = JSON.parse(e);
      await AcademicDepartmentService.createDepartmentFromEvent(data);
    }
  );
  //   RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_UPDATED, async (e: string) => {
  //     const data = JSON.parse(e);
  //     await AcademicFacultyService.updateOneIntoDBFromEvent(data);
  //   });
  //   RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_DELETED, async (e: string) => {
  //     const data = JSON.parse(e);
  //     await AcademicFacultyService.deleteOneFromDBFromEvent(data.id);
  //     // eslint-disable-next-line no-console
  //     console.log('Updated data: ', data);
  //   });
};

export default initAcademicDepartmentEvents;
