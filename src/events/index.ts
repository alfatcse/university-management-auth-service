import InitAcademicSemesterEvents from '../app/modules/academicSemester/academicSemester.event';
import initAcademicFacultyEvents from '../app/modules/academicFaculty/academicFaculty.event';
import initAcademicDepartmentEvents from '../app/modules/academicDepartment/academicDepartment.event';
const subscribeToEvents = () => {
  InitAcademicSemesterEvents();
  initAcademicFacultyEvents();
  initAcademicDepartmentEvents();
};
export default subscribeToEvents;
