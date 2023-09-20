import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_FACULTY_CREATED } from './academicFaculty.constants';
import { IAcademicFacultyCreatedEvent } from './academicFaculty.interfaces';
import { AcademicFacultyService } from './academicFaculty.service';

const initAcademicFacultyEvents = () => {
  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_CREATED, async (e: string) => {
    const data: IAcademicFacultyCreatedEvent = JSON.parse(e);
    await AcademicFacultyService.createAcademicFacultyFromEvent(data);
    //console.log(data);
  });

  //   RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_UPDATED, async (e: string) => {
  //     const data = JSON.parse(e);
  //     await AcademicSemesterService.updateOneIntoDBFromEvent(data);
  //     //console.log("Updated data: ", data);
  //   });

  //   RedisClient.subscribe(EVENT_ACADEMIC_SEMESTER_DELETED, async (e: string) => {
  //     const data = JSON.parse(e);

  //     await AcademicSemesterService.deleteOneFromDBFromEvent(data.id);
  //     // eslint-disable-next-line no-console
  //     console.log('Updated data: ', data);
  //   });
};

export default initAcademicFacultyEvents;
