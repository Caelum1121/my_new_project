import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const CustomContent = () => {
  return (
    <div className='custom-content'>
      <Row>
        <Col xs='12' className='text-center'>
          <h2>Welcome to the Official RMIT Store</h2>
          <p className='lead'>
            Your one-stop shop for all official RMIT University merchandise.
          </p>
          <p>
            Show your university pride with our exclusive range of apparel, accessories, and gifts. Whether you're a student, alumni, or staff member, we have something for everyone.
          </p>
          <Button color='primary' href='/shop'>
            Shop Now
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CustomContent;
