import InitAcademicSemesterEvents from '../app/modules/academicSemester/academicSemester.event';
import initAcademicFacultyEvents from '../app/modules/academicFaculty/academicFaculty.event';
const subscribeToEvents = () => {
  InitAcademicSemesterEvents();
  initAcademicFacultyEvents();
};
export default subscribeToEvents;
