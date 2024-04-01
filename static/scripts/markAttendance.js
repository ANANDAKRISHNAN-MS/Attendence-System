
document.getElementById('toggleAttendance').addEventListener('click', function() {
    // Hide the existing student details table
    document.querySelector('.card:nth-child(2)').style.display = 'none';
   
    // Show the attendance table placeholder
    document.getElementById('attendanceTable').style.display = 'block';
   
    // Generate the attendance table rows
    const studentInfo = document.getElementById('studentInfo').querySelectorAll('tr');
    const attendanceRows = document.getElementById('attendanceRows');
    attendanceRows.innerHTML=""
    studentInfo.forEach(row => {
       const name = row.querySelector('td:first-child').textContent;
       const id = row.querySelector('td:first-child').id;
       const newRow = document.createElement('tr');
       
   
       // Create checkbox for attendance
       const attendanceCheckbox = document.createElement('input');
       attendanceCheckbox.type = 'checkbox';
       attendanceCheckbox.name = 'attendance';
       attendanceCheckbox.value = id;
       attendanceCheckbox.className='attendance';
   
       // Create name cell
       const nameCell = document.createElement('td');
       nameCell.textContent = name;
   
       // Append checkbox and name to the new row
       newRow.appendChild(nameCell);
       newRow.appendChild(attendanceCheckbox);
   
       // Append the new row to the attendance table
       attendanceRows.appendChild(newRow);
    });
   });

document.addEventListener("DOMContentLoaded", function() {

   const submitAttendance = async ()=>{
    try {
        const date = document.getElementById('currDate').value;
        const period = document.getElementById('period').value;
        const checkBox = document.getElementsByClassName('attendance');
        const params = window.location.search
        const id = new URLSearchParams(params).get('id')
        const data ={
            tcc_code:id,
            date : date,
            period : period,
            attendanceData : Array.from(checkBox).map((student)=>{
                let attend='A';
                if(student.checked){
                    attend='P';
                }
                return[student.defaultValue,attend];
            })
        }
        const res = await axios.post('/attendance/manually',data);
        displayMsg.innerText=res.data;
        displayMsg.style.border='1.5px solid #66FF00';
        displayMsg.style.color='#008080';
        displayMsg.style.display='block';  

        getInfo()

        setTimeout(()=>{
            attendanceTable.style.display = 'none';
            studentDetailsTable.style.display = 'block';
            toggleButton.textContent = 'Mark Attendance';
            isAttendanceMode = false;

        },1000)
    } catch (error) {
        displayMsg.innerText=error.response.data;
        displayMsg.style.border='1.5px solid red';
        displayMsg.style.color='#FF004F';
        displayMsg.style.display='block';
    }
 }

 const generateQR = async () =>{
    try {
        const date = document.getElementById('currDate').value;
        const period = document.getElementById('period').value;
        const params = window.location.search
        const id = new URLSearchParams(params).get('id')
        const qrCard = document.getElementById("qrCard");
        const qrImg = document.querySelector('.qrCode img')
        const checkBox = document.getElementsByClassName('attendance');

        const uniqueId =`${id}@${date}@${period}`;

        qrCard.style.display='block';
        const data = {
            uniqueId:uniqueId,
            attendanceData : Array.from(checkBox).map((student)=>{
                return student.defaultValue;
            })
        }

        const res = await axios.post('/attendance/generateQr',data);

        const encodedUniqueId = encodeURIComponent(uniqueId);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedUniqueId}`;
        
        setTimeout( async ()=>{
            qrImg.src=" ";
            qrCard.style.display='none';
            const newData = {
                uniqueId:uniqueId 
            } 
            const resp = await axios.post('/attendance/deleteQr',newData);
            getInfo();
        },60000);
        

    } catch (error) {
        console.log(error)
    }
 }
 
     const toggleButton = document.getElementById('toggleAttendance');
     const attendanceTable = document.getElementById('attendanceTable');
     const studentDetailsTable = document.querySelector('.card:nth-child(2)');
     let isAttendanceMode = false; // Flag to track the current mode
    
     toggleButton.addEventListener('click', function() {
        if (!isAttendanceMode) {
          // Hide the student details table and show the attendance table
          studentDetailsTable.style.display = 'none';
          attendanceTable.style.display = 'block';
          toggleButton.textContent = 'Back';
          isAttendanceMode = true;
          document.getElementById('period').selectedIndex=null;
          document.getElementById('displayMsg').style.display='none';
        } else {
          // Hide the attendance table and show the student details table
          attendanceTable.style.display = 'none';
          studentDetailsTable.style.display = 'block';
          toggleButton.textContent = 'Mark Attendance';
          isAttendanceMode = false;
        }
     });
 
     document.getElementById("currDate").valueAsDate=new Date();
 
     document.getElementById('submitAttendance').addEventListener('click',function(e){
       e.preventDefault();
       const displayMsg = document.getElementById('displayMsg');
       displayMsg.style.display='none';
 
       if(document.getElementById('period').value==="null"){
          displayMsg.innerHTML="Select the Period";
          displayMsg.style.border='1.5px solid red';
          displayMsg.style.color='#FF004F';
          displayMsg.style.display='block';
       }
       else{
          submitAttendance();
       }
 
     })

     document.getElementById('generateQR').addEventListener('click',function(e){
        e.preventDefault();
        displayMsg.style.display='none';

        if(document.getElementById('period').value==="null"){
            displayMsg.innerHTML="Select the Period";
            displayMsg.style.border='1.5px solid red';
            displayMsg.style.color='#FF004F';
            displayMsg.style.display='block';
         }
         else{
            generateQR()
         }
     })
     
});
    