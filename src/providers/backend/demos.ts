function doAsyncTask(cd){
    setTimeout(()=>{
        console.log('Async Task');
        cd();
    },3000  );
}

doAsyncTask(()=>{ console.log('Callback log') });