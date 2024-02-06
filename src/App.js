import './App.css';
import {useEffect, useRef, useState} from "react";

function App() {
    const [list, setList] = useState(''); // 명단 textarea
    const [numPeople, setNumPeople] = useState(0); // 인원수 계산
    const [, setRender] = useState(false); // 아래 useRef 렌더링 위해
    const rows = useRef(5) // 행
    const cols = useRef(6) // 열
    const disable = useRef(0); // 비활성화 된 자리 수

    // 페이지 로딩 시 최초 한번 기본값의 행렬으로 테이블 생성
    useEffect(() => {
        createTable(rows.current, cols.current);
    }, []);

    // 랜덤 배치 버튼 클릭 시 우측 테이블에 이름을 랜덤으로 넣어줌
    const random = () => {
        let table = document.getElementById('tid');
        if (!table) return; // 테이블이 없으면 함수 종료

        // td의 값을 비워줌
        for (let i = 0; i < rows.current; i++) {
            for (let j = 0; j < cols.current; j++) {
                table.rows[i].cells[j].textContent = '';
            }
        }

        if (numPeople <= 0) {
            window.alert("명단을 입력하세요");
            return;
        }

        if (rows.current * cols.current - disable.current <= 0) {
            window.alert("활성화된 자리가 없습니다.");
            return;
        }

        if (numPeople > rows.current * cols.current - disable.current) {
            window.alert("인원수보다 자리가 적습니다.");
            return;
        }

        // 명단의 각 행(빙 행 제외)의 이름을 가져와 테이블에 삽입
        let lines = list.split('\n');
        let nonEmptyLines = lines.filter(line => line.trim() !== '');
        for (let i = 0; i < nonEmptyLines.length; i++) {
            let check = true;
            let r = 0;
            let c = 0;
            while (check) { // 랜덤으로 정한 행에 활성화 되고 빈 행이 있다면 탈출
                r = Math.floor(Math.random() * rows.current)
                for (let j = 0; j < cols.current; j++) {
                    if (table.rows[r].cells[j].style.backgroundColor === 'rgb(227, 253, 253)' && table.rows[r].cells[j].textContent === '') {
                        check = false
                        break;
                    }
                }
            }
            check = true;
            while (check) { // 랜덤으로 정한 열이 활성화 되고 빈행이라면 탈출
                c = Math.floor(Math.random() * cols.current)
                if (table.rows[r].cells[c].style.backgroundColor === 'rgb(227, 253, 253)' && table.rows[r].cells[c].textContent === '') {
                    check = false
                }
            }
            // 테이블에 이름 삽입
            table.rows[r].cells[c].textContent = nonEmptyLines[i]
        }
    }

    const addRow = () => { // 행 추가
        createTable(rows.current = rows.current + 1, cols.current);
    }
    const removeRow = () => { // 행 제거
        if (rows.current > 1)
            createTable(rows.current = rows.current - 1, cols.current);
    }
    const addCol = () => { // 열 추가
        createTable(rows.current, cols.current = cols.current + 1);
    }
    const removeCol = () => { // 열 제거
        if (cols.current > 1)
            createTable(rows.current, cols.current = cols.current - 1);
    }
    // 테이블 초기화
    const reset = () => createTable(rows.current = 5, cols.current = 6);

    // 테이블 생성
    const createTable = (rows, cols) => {
        // 테이블이 이미 존재 한다면 제거
        if (document.getElementById('tid')) {
            document.getElementById('seatList').removeChild(document.getElementById('tid'));
        }
        let table = document.createElement('table');
        table.id = 'tid'
        for (let i = 0; i < rows; i++) {
            let tr = table.insertRow();
            for (let j = 0; j < cols; j++) {
                let td = tr.insertCell();
                td.style.backgroundColor = '#E3FDFD'
                td.addEventListener('click', function () {
                    this.style.backgroundColor = this.style.backgroundColor === 'rgb(227, 253, 253)' ? enableFalse() : enableTrue();
                });
            }
        }
        // seatList라는 id를 가진 element에 table을 append
        document.getElementById('seatList').appendChild(table)

        // 비활성화된 자리 개수 변수 초기화
        disable.current = 0;
        // useRef이기에 useState로 렌더링
        setRender(prevState => !prevState)
    }

    // 자리 비활성화
    const enableFalse = () => {
        ++disable.current;
        setRender(prevState => !prevState)
        return '#71C9CE'
    }

    // 자리 활성화
    const enableTrue = () => {
        --disable.current;
        setRender(prevState => !prevState)
        return '#E3FDFD'
    }

    // textarea 높이 동적 설정
    const adjustHeight = (element) => {
        element.style.height = "auto";
        element.style.height = (element.scrollHeight) + "px";
    }


    return (
        <div className="container-block">
            <div className="container-flex">
                <div className="pd-10">
                    <div className="div-front">명단 <span className="span-min">({numPeople}명)</span></div>
                    <textarea
                        placeholder='한줄에 한명씩 입력'
                        value={list}
                        onChange={e => {
                            setList(e.target.value)
                            let lines = e.target.value.split('\n');
                            let nonEmptyLines = lines.filter(line => line.trim() !== '');
                            setNumPeople(nonEmptyLines.length);
                            adjustHeight(e.target)
                        }}></textarea>
                    <br/>
                    <button className="btn-random" onClick={() => random()}>랜덤 배치</button>
                    <br/><br/><br/>
                </div>
                <div className="pd-10">
                    <div className="btn-inner">
                        <div className="btn-inner-inner">
                            <button className="btn-add" onClick={() => addRow()}>행 +</button>
                            <button className="btn-remove" onClick={() => removeRow()}>행 -</button>
                            <button className="btn-add" onClick={() => addCol()}>열 +</button>
                            <button className="btn-remove" onClick={() => removeCol()}>열 -</button>
                            <button className="btn-reset" onClick={() => reset()}>초기화</button>
                        </div>
                        <p>각 자리 클릭시 공석 지정 또는 해제</p>
                    </div>
                    <div>
                        <div className="div-front">칠판 <span
                            className="span-min">({rows.current * cols.current - disable.current}자리)</span>
                        </div>
                    </div>
                    <div id="seatList" className="seatList"></div>
                </div>
            </div>
        </div>
    );
}

export default App;