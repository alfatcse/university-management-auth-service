import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_FACULTY_CREATED,
  EVENT_ACADEMIC_FACULTY_DELETED,
  EVENT_ACADEMIC_FACULTY_UPDATED,
} from './academicFaculty.constants';
import { IAcademicFacultyCreatedEvent } from './academicFaculty.interfaces';
import { AcademicFacultyService } from './academicFaculty.service';
const initAcademicFacultyEvents = () => {
  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_CREATED, async (e: string) => {
    const data: IAcademicFacultyCreatedEvent = JSON.parse(e);
    await AcademicFacultyService.createAcademicFacultyFromEvent(data);
  });
  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    await AcademicFacultyService.updateOneIntoDBFromEvent(data);
  });
  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_DELETED, async (e: string) => {
    const data = JSON.parse(e);
    await AcademicFacultyService.deleteOneFromDBFromEvent(data.id);
  });
};

export default initAcademicFacultyEvents;
