import React from "react";
import { CenteredContainer } from "../centeredContainer/centeredContainer.ui";

const Loading = () => {
  return (
    <CenteredContainer>
      <img src={"loading.svg"} alt="loading" />
    </CenteredContainer>
  );
};

// `React.memo` doğru şekilde bileşeni sarmalıyor
export default React.memo(Loading);
