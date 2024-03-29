import {
  IAcademicSemesterMonths,
  IAcademicSemesterTitles,
  IAcademicSemesterCodes,
} from './academicSemester.interface';
export const academicSemesterTitles: IAcademicSemesterTitles[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const academicSemesterCodes: IAcademicSemesterCodes[] = [
  '01',
  '02',
  '03',
];
export const academicSemesterMonths: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
export const academicSemesterSearchableFields = ['title', 'code', 'year'];
export const academicSemesterFilterableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
  'syncId',
];
export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semester.create';
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semester.update';
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semester.delete';
