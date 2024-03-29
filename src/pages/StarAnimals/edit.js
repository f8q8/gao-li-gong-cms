import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Icon, Input, Tooltip, Typography } from 'antd';

import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ImgUPload from '@/components/ImgUpload'
import RichTextEditor from '@/components/RichTextEditor';

import styles from './edit.less';

@Form.create({
  onValuesChange(prop, changedValues) {
    const {
      currentAnimal,
      dispatch,
    } = prop;

    dispatch({
      type: 'starAnimals/save',
      payload: {
        currentAnimal: {
          ...currentAnimal,
          ...changedValues,
        },
      },
    });
  },
})
class StarAnimalEdit extends Component {
  handleChange = (value, key) => {
    const {
      dispatch,
      currentAnimal,
    } = this.props;

    dispatch({
      type: 'starAnimals/save',
      payload: {
        currentAnimal: {
          ...currentAnimal,
          [key]: value,
        },
      },
    });
  };

  handleUploadChange = (value, key) => {
    this.handleChange(JSON.stringify(value), key);
  };

  handleSave = () => {
    const {
      dispatch,
      currentAnimal,
    } = this.props;

    dispatch({
      type: 'starAnimals/updateAnimal',
      payload: { ...currentAnimal },
    });
  };

  render() {
    const {
      currentAnimal,
      form: { getFieldDecorator },
    } = this.props;
    const imgLim = {
      mini: 50,
      main: 50,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 15 },
      },
    };
    const labelTip = (lim, tip) => <span>{tip}&nbsp;<Tooltip title={`最多可上传 ${lim} 张图片`}><Icon type='question-circle-o' /></Tooltip></span>;

    if (!currentAnimal) {
      return <PageLoading />;
    }

    return (
      <React.Fragment>
        <PageHeaderWrapper />
        <Card bordered={false} style={{marginTop: '1em'}} className={styles.editAnimal}>
          <Form onSubmit={this.handleSubmit} style={{marginTop: 8}}>
            <Form.Item {...formItemLayout} colon={false} label={<></>}>
              <Typography.Title level={3} style={{textAlign: 'center'}}>{currentAnimal.name}</Typography.Title>
            </Form.Item>
            <Form.Item {...formItemLayout} label={<span>简介</span>}>
              {getFieldDecorator('brief', {
                initialValue: currentAnimal.brief,
              })(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={labelTip(imgLim.mini, '缩略图')}>
              <ImgUPload
                fileList={JSON.parse(currentAnimal.thumbnail)}
                limit={imgLim.mini}
                onChange={(fileList) => this.handleUploadChange(fileList, 'thumbnail')}
              />
            </Form.Item>
            <Form.Item {...formItemLayout} label={labelTip(imgLim.mini, '图片')}>
              <ImgUPload
                fileList={JSON.parse(currentAnimal.imgUrl)}
                limit={imgLim.mini}
                onChange={(fileList) => this.handleUploadChange(fileList, 'imgUrl')}
              />
            </Form.Item>
            <Form.Item {...formItemLayout} label={<span>详情&nbsp;<Tooltip title='Ctrl + S 保存当前编辑进度'><Icon type='question-circle-o' /></Tooltip></span>}>
              <RichTextEditor value={currentAnimal.content} onChange={e => this.handleChange(e, 'content')} />
            </Form.Item>
            <Form.Item {...formItemLayout} colon={false} label={<></>}>
              <Button type='primary' htmlType='submit' onClick={this.handleSave}>保存</Button>
            </Form.Item>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
};

const mapStateToProps = state => ({
  currentAnimal: state.starAnimals.currentAnimal,
});
export default connect(mapStateToProps)(StarAnimalEdit);
