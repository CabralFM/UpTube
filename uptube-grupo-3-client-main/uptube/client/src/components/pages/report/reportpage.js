import "./reportpage.scss";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useSession} from "../../../providers/UserContext";
import {useHistory} from "react-router-dom";

function ReportPage() {

    const session = useSession();
    const {id_user, refresh} = useSession();
    const history = useHistory();

    return (
        <div className={"report-page"}>
            {session?.id_user &&
                <>
                    <div className={"report-page-container"}>
                        <p>O vídeo foi reportado.</p>
                        <p>A equipa UPtube analisará o conteúdo e contactará consigo muito em breve.</p>
                        <button className={"thankyou-button-report"}
                        onClick={(e) => history.push('/homepage')}>Regressar à Homepage</button>
                    </div>
                </>}
        </div>
    )
}

export default ReportPage;