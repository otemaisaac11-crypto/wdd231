
// 1. Import your default and named modules at the very top
import byuiCourse from './course.mjs';
import { setSectionSelection } from './sections.mjs';
import { setTitle, renderSections } from './output.mjs';

// 2. Build your event listeners and manually trigger UI updates
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum);
  renderSections(byuiCourse.sections); // Re-renders the updated sections list
});

document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum, false);
  renderSections(byuiCourse.sections); // Re-renders the updated sections list
});

// 3. Initialize the page data on load
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);