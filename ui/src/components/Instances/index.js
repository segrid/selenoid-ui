import React from "react";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StyledSessions } from "./style.css";
import BeatLoader from "react-spinners/BeatLoader";

import styled from "styled-components/macro";
import { useInstanceUpdate } from "./service";

const Instances = ({ instances = {}, query = "" }) => {
    function withQuery(query, instances) {
        return id => {
            if (id.includes(query)) {
                return true;
            }

            if (instances[id].instanceName.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }

            if (instances[id].instanceId.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }

            return query === "";
        };
    }

    const ids = Object.keys(instances)
        .filter(withQuery(query, instances))
        ;
    
    return (
        <StyledSessions>
            <div className={`section-title section-title_hidden-${!!query}`}>Instances</div>
            <TransitionGroup className="sessions__list">
                {ids.map(id => {
                    return (
                        <CSSTransition key={id} timeout={500} classNames="session_state" unmountOnExit>                           
                            <Instance id={id} instance={instances[id]} />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
            <CSSTransition
                in={!ids.length}
                timeout={500}
                exit={false}
                classNames="sessions__no-any_state"
                unmountOnExit
            >
                <div className="no-any">
                    <div title="No any" className="icon dripicons-hourglass" />
                    <div className="nosession-any-text">NO INSTANCES YET :'(</div>
                </div>
            </CSSTransition>
        </StyledSessions>
    );
};

const Instance = ({ id, instance}) => {
    const [deleting, deleteInstance] = useInstanceUpdate(id, 'terminate');
    const [stopping, stopInstance] = useInstanceUpdate(id, 'stop');
    const [starting, startInstance] = useInstanceUpdate(id, 'start');
    const [refreshing, refreshInstance] = useInstanceUpdate(id, 'refresh');

    return (
        <tr className="session" id={id}>
            <SessionId>
                <span className="quota">{instance.instanceName}</span>
            </SessionId>
            <Link className="identity">
                
            </Link>
            <Capabilities>
                <td className="capability capability__manual">{instance.currentSessionsCount}/ {instance.maxSessions}</td>
            </Capabilities>
            <Capabilities>
                <td className="capability">{instance.hubReady}</td>
            </Capabilities>
            <Capabilities>
                <td className="capability  capability__resolution">{instance.instanceState}</td>
            </Capabilities>
             <Actions>
                <div className="capability capability__session-delete" onClick={refreshInstance}>
                    {refreshing ? (
                        <BeatLoader size={2} color={"#fff"} />
                    ) : (
                        <img title="Refresh" className="icon white-icon" src="https://raw.githubusercontent.com/feathericons/feather/master/icons/refresh-cw.svg" alt="Refresh" height="15px" width="15px"></img>
                    )}
                </div>
                <div className="capability capability__session-delete" onClick={startInstance} disabled={instance.instanceState == 'stopped'? true : false}>
                    {starting ? (
                        <BeatLoader size={2} color={"#fff"} />
                    ) : (
                        <img title="Start" className="icon green-icon" src="https://raw.githubusercontent.com/feathericons/feather/master/icons/play-circle.svg" alt="Start" height="15px" width="15px"></img>
                    )}
                </div>
                <div className="capability capability__session-delete" onClick={stopInstance}>
                    {stopping ? (
                        <BeatLoader size={2} color={"#fff"} />
                    ) : (
                        <img title="Stop" className="icon red-icon" src="https://raw.githubusercontent.com/feathericons/feather/master/icons/stop-circle.svg" alt="Stop" height="15px" width="15px"></img>
                    )}
                </div>
                <div className="capability capability__session-delete" onClick={deleteInstance}>
                    {deleting ? (
                        <BeatLoader size={2} color={"#fff"} />
                    ) : (
                        <img title="Terminate" className="icon red-icon" src="https://raw.githubusercontent.com/feathericons/feather/master/icons/trash-2.svg" alt="Terminate" height="15px" width="15px"></img>
                    )}
                </div>
            </Actions>
        </tr>
    );
};

const primaryColor = "#fff";
const secondaryColor = "#aaa";

const SessionId = styled.td`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex-basis: 140px;
    padding-right: 5px;

    .quota {
        color: ${secondaryColor};
        margin-right: 3px;
    }

    .id {
        margin-left: 3px;
        text-decoration: none;
        color: ${primaryColor};
    }
`;

const Capabilities = styled.td`
    display: flex;
    align-items: center;
    flex: 1;
`;

const Actions = styled.td`
    display: flex;
    align-items: center;
`;

export default Instances;
