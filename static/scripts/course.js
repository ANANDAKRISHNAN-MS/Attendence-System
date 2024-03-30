const params = window.location.search
const id = new URLSearchParams(params).get('id')
const code = new URLSearchParams(params).get('code')
const name = new URLSearchParams(params).get('name')

const getInfo = async ()=>{
    try{
        const res = await axios.get('/courses/studentlist',{
            params:{
                tcc_code:id
            }
        });
        const studentList = res.data.studentList;
        const className = document.getElementById('className');
        const semester = document.getElementById('courseSem');
        const totalPeriod= document.getElementById('totalPeriod');
        const studentInfo = document.getElementById('studentInfo');
        className.innerHTML=studentList.className;
        semester.innerHTML=studentList.semester;
        totalPeriod.innerHTML=studentList.totalPeriod;
        if(typeof(studentList.names)==="object"){
            if(studentList.totalPeriod===0){
                const studentInfoList = studentList.names.map(student=>{
                    return `<tr>
                    <td class="font-medium">${student[0]}</td>
                    <td>${student[1]}</td>
                    <td>0%</td>
                  </tr>`
                }).join('');
                studentInfo.innerHTML=studentInfoList;
            }
            else{
                const studentInfoList = studentList.names.map(student=>{
                    let percentage = Number(student[1])*100/Number(studentList.totalPeriod);
                    return `<tr>
                    <td class="font-medium">${student[0]}</td>
                    <td>${student[1]}</td>
                    <td>${parseFloat(percentage.toFixed(2))}%</td>
                  </tr>`
                }).join('');
                studentInfo.innerHTML=studentInfoList;
            }
            
        }
        else{
            studentInfo.innerHTML=`<h3 style="paddinf:10px">${studentList.names}</h3>`; 
        }
    }
    catch(error){
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded',function(){ 
    const courseCode = document.getElementById('courseCode');
    const courseName = document.getElementById('courseName');   
    courseCode.innerHTML=code;
    courseName.innerHTML=name;
    getInfo();
})