import React from 'react';
import { Row } from 'react-bootstrap';

import InfiltratorListEntry from './infiltratorListEntry';

const InfiltratorList = ({ infiltrators }) => (
  <Row>
    <h5>Hide This List Of Infiltrators:</h5>
    <Row className="infiltrator-list-entry">
      {infiltrators.map(infiltrator => (
        <InfiltratorListEntry key={infiltrator} infiltrator={infiltrator} />
      ))}
    </Row>
  </Row>
);

export default InfiltratorList;
