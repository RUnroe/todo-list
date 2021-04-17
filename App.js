import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

const todoListState = atom({
  key: 'todoListState',
  default: [],
});


const Filter = ({setFilter}) => {
  let radio_props = [
    {label: "All",         value: null },
    {label: "Completed",   value: true },
    {label: "Uncompleted", value: false }
  ]

  return (
    <View style={styles.filterSection}>
      <RadioForm
          radio_props={radio_props}
          initial={0}
          animation={true}
          onPress={(value) => {
            setFilter(value);
          }}
        />
    </View>
  );
}

const Stats = () => {
  const todos = useRecoilValue(todoListState);
  const getCount = (property, value) => {
    let list;
    if(property != null && value != null) list = todos.filter((todoItem) => (todoItem[property] == value));
    else list = todos;

    return list.length;
  }
  let totalCount       = getCount();
  let completedCount   = getCount("isComplete", true);
  let uncompletedCount = getCount("isComplete", false);
  let percentComplete  = (Math.floor((completedCount / totalCount) * 100));
  percentComplete = Number.isNaN(percentComplete) ? 0 : percentComplete;
  

  return (
    <View style={styles.statSection}>
      <Text>Total: {totalCount}</Text>
      <Text>Completed Count: {completedCount}</Text>
      <Text>Uncompleted Count: {uncompletedCount}</Text>
      <Text>Percent Complete: {percentComplete}%</Text>
    </View>
  );
}


function TodoList() {
  const [filter, setFilter] = React.useState(null);
  const todos = useRecoilValue(todoListState);
   
  const completionFilter = todoItem => {
    if(filter == null) return true;
    return todoItem.isComplete == filter;
  }

  
  return (
    <View>
      <Filter setFilter={setFilter} />
      <View style={styles.todoList}>
        {todos.filter(completionFilter).map((todoItem) => (
          <Todo key={todoItem.id} item={todoItem} />
        ))}
        <TodoForm />
      </View>
      <Stats />
    </View>
  )
}

function Todo({ key, item }) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);
  const [value, setValue] = React.useState(todoList[index].text);


  const removeTodo = () => {
    //slice by key
    let newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  }
  

  const completeTodo = () => {
    //change property by key
    let newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete
    });
    setTodoList(newList);
    
  }


  const replaceItemAtIndex = (arr, index, newValue) => {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }

  return (
    <View style={styles.todo}>
      <TextInput 
        style={{ textDecoration: item.isComplete ? "line-through" : "" }} 
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <View style={{flexDirection: 'row'}}>
        <Button onPress={() => completeTodo()} title="Complete" />
        <Button onPress={() => removeTodo()} title="x" />
      </View>
    </View>
  );
}

function TodoForm() {
  const [value, setValue] = React.useState("");
  const setTodoList = useSetRecoilState(todoListState);
  const todos = useRecoilValue(todoListState);

  const getId = () => {
    return Math.max(...todos.map(o => o.id)) + 1;
  }

  const addItem = () => {
    if (!value) return;
    setTodoList((oldList) => [
      ...oldList,
      {
        id: getId(),
        text: value,
        isComplete: false
      }
    ]);
    setValue("");
  }


  return (
    <View>
      <TextInput
        style={styles.input}
        value={value}
        placeholder="Add a todo item here"
        onChange={e => setValue(e.target.value)}
        onKeyPress={e => {if(e.keyCode == 13) addItem();}}
      />
      
    </View>
  );
}


function App() {
 

  return (
    <RecoilRoot>
      <View style={styles.app}>
        <TodoList />
      </View>
    </RecoilRoot>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  app: {
    backgroundColor: '#209cee',
    height: '100vh',
    padding: 30,
  },
  todoList: {
    background: '#e8e8e8',
    borderRadius: 4,
    maxWidth: 400,
    padding: 5,
    display: 'flex',
    flexFlow: 'column nowrap'
  },
  todo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 3,
    boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    fontSize: 12,
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#209cee",
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 5
  },
  filterSection: {
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    maxWidth: 400,
    marginBottom: 20
  }
});


export default App;