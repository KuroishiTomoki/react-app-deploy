import { useEffect, useState } from 'react';
import './App.css'
import { Input } from './assets/components/Input';
import { InputOutput } from './assets/components/InputOutput';
import { Log } from './assets/components/Log';
import { RegisterButton } from './assets/components/RegisterButton';
import { supabase } from '../lib/supabase';

function App() {
  
  // 要素
  const [records, setRecords] = useState([]);
  // 
  const [content, setContent] = useState("");
  // 学習時間
  const [time, setTime] = useState(0);
  // 学習合計時間
  const [sumTime, setSumTime] = useState(0);
  // エラー表示
  const [error, setError] = useState("");
  // Loading
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    // DBからデータ読み込み
    const fetchRecords = async () => {
      setLoading(true);
      
      const { data, error } = await supabase.from('study-record').select('*');
      
      setLoading(false);
      
      console.log(data, error);
      if (error) return;

      setRecords(data);
      setSumTime(data.reduce((sum, record) => sum + record.time, 0));
    };

    // 読み込み実行
    fetchRecords();
  }, []);

  // 登録
  const onRegister = async () => {
    if(content == "" || time <= 0){
      setError(true);
      return;
    }
    else{
      setError(false);
    }

    const insertRecord = {title:content, time:time};

    const { data, error } = await supabase.from("study-record").insert(insertRecord).select().single();
    if(error){
      alert("登録に失敗しました");
    }
    console.log(`${data.id} error:${error}`)  
        
    const newRecords = [...records, data];
    setRecords(newRecords);
    setSumTime(sumTime + parseInt(time, 10));
    setContent("");
    setTime(0);
  }

  // 消去
  const onDelete = async (id) => {
    const {data, error} = await supabase.from("study-record").delete().eq("id", id);

    const deleteData = records.find((x) => x.id === id);
    setRecords(records.filter((x) => x.id !== id))
    setSumTime(sumTime - Number(deleteData.time))
  }

  
  return (
    <>
      <h1>学習記録一覧</h1>
      <Input title = "学習内容" value = {content} setValue={setContent} placeholder = "学習記録を記載ください" type="text"/>
      <Input title = "学習時間" value = {time} setValue={setTime} placeholder = "学習時間を記載ください" type="number"/>

      <InputOutput title="入力されている学習内容" text={content}/>
      <InputOutput title="入力されている学習時間" text={time}/>
      <RegisterButton onRegister={onRegister}/>

      {error && <p>入力されてない項目があります</p>}
      
      {loading ? (
        <p>読み込み中</p>
      ):(
        <>
          <Log records = {records} onDelete = {onDelete} />
          <p>{sumTime} / 1000(h)</p>
        </>
      )}
    </>
  )
}

export default App
