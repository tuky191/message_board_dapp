import { Modal } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ReactHtmlParser from 'react-html-parser';

const GenericModal = ({
  title,
  body,
  setIsGenericModalVisible,
  isGenericModalVisible,
  footer,
}) => {
  return (
    <Modal
      visible={isGenericModalVisible}
      onCancel={() => {
        setIsGenericModalVisible(false);
      }}
      title={title}
      className='modal-dialog modal-lg'
      footer={footer}
    >
      <div>
        <div>
          <link
            href='https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
            rel='stylesheet'
          ></link>
          <div className='container bootdey'>
            <div className='well .well-light-blue mini-profile-widget'>
              <div className='details'>
                <div>{ReactHtmlParser(body)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default GenericModal;
