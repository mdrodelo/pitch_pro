//import ReactSlider from "react-slider";
import React from 'react';
import {Checkbox, RangeSlider, Row, Col, InputGroup, InputNumber } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import {useEffect, useState} from "react";
// TODO make the sliders look nicer
export default function Slider(props) {
    const [length, setLength] = useState(200);
    const [arr, setArr] = useState([]);
    const [value, setValue] = useState([10, 50]);
    const [check, setCheck] = useState(false);
    function handleCheckbox(e) {
        if (e.target.checked) setCheck(true);
        else setCheck(false);
        handleUpdate();
    }
    //const handleCheckbox = (value) => setCheck(checked); handleUpdate();
    function handleUpdate() {
        props.updateSliderArr([props.index, value[0], value[1], check]);
        //console.log(props.index, value[0], value[1], check);
    }
    useEffect(() => {
        if (props.gpxElement != null){
            setLength(props.gpxElement.length);
            let gpxArr = [];
            for (let i = 0; i < props.gpxElement.length; i++) {
                //console.log(props.gpxElement[i].getElementsByTagName("time")[0].innerHTML);
                gpxArr.push(props.gpxElement[i].getElementsByTagName("time")[0].innerHTML);
            }
            setArr(gpxArr);
        }
        //console.log(props.gpxElement);
    }, [props.gpxElement]);

    // https://rsuitejs.com/guide/usage/
    // RangeSlider, InputNumber
    return (
        <div id={props.key}>
    <Row>
        <Col><Checkbox
            onChange={(value, checked, event) => {
                handleCheckbox(event);
            }}
        /></Col>
      <Col md={10} xs={12}>
        <RangeSlider
            min={0}
            max={length}
          progress
          style={{ marginTop: 16 }}
          value={value}
            handleTitle={arr[value]}
          onChange={value => {
            setValue(value);
            handleUpdate();
          }}
        />
      </Col>
      <Col md={8} xs={12}>
          <Row>
        <InputGroup>
          <InputNumber
            min={0}
            max={length}
            value={value[0]}
            onChange={nextValue => {
              const [start, end] = value;
              if (nextValue > end) {
                return;
              }
              setValue([nextValue, end]);
              handleUpdate();
            }}
          />
          <InputGroup.Addon>to</InputGroup.Addon>
          <InputNumber
            min={0}
            max={length}
            value={value[1]}
            onChange={nextValue => {
              const [start, end] = value;
              if (start > nextValue) {
                return;
              }
              setValue([start, nextValue]);
              handleUpdate();
            }}
          />
        </InputGroup>
              </Row>

      </Col>
    </Row>
        <Row>
              <Col id="start-time">{arr[value[0]]}</Col>
              <Col id="end-time">{arr[value[1]]}</Col>
          </Row>
            </div>
    );
}
