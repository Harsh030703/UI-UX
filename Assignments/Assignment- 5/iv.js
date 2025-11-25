const student={name:"Aarav",age:20,grades:{math:78,cs:88}};
student.class="CSE-2";
student.grades.cs=92;
Object.entries(student).forEach(([k,v])=>console.log(k,typeof v==="object"?JSON.stringify(v):v));
