import React, { Component, Fragment } from 'react';
import {
    NavLink,
    Container,
    Row,
    Col
} from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faCoffee } from '@fortawesome/fontawesome-free-solid';

library.add(fab, faCheckSquare, faCoffee);


class Footer extends Component {
    state = {
        
    };
    render(){
        return(
            <Fragment>
                <Container className="footer-nav mt-5">
                    <Row>
                        <Col xs="12" sm="6" lg="3" className="social-icons">
                            <h4>Connect</h4>
                            <br/>

                            <NavLink href="https://www.linkedin.com/in/winston-cai-925903178" target="_blank">
                                <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
                            </NavLink>

                            <NavLink href="https://www.facebook.com/winston.cai.5/" target="_blank">
                                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                            </NavLink>

                            <NavLink href="https://www.youtube.com/channel/UCyE0yE4NjvNbWRVjTgS24ng" target="_blank">
                                <FontAwesomeIcon icon={['fab', 'youtube']} />
                            </NavLink>

                            <NavLink href="https://www.instagram.com/winstoncai/" target="_blank">
                                <FontAwesomeIcon icon={['fab', 'instagram',]} />
                            </NavLink>

                            <NavLink href="https://github.com/endgameprophecy?tab=overview&from=2020-08-01&to=2020-08-31" target="_blank">
                                <FontAwesomeIcon icon={['fab', 'github',]} />
                            </NavLink>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="terms">
                            <p>Winston Cai | James Chu</p>
                            <p>© 2020 CryptoGreen</p>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}

export default Footer;