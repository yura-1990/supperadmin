import * as React from "react";
import { lazyLoad } from "../../../../../utils/loadable";
import { LoadingIndicator } from "../../../../components/LoadingWrapper";
import { LoadingWrapper } from "../../../../components/LoadingWrapper/index.style";

export const Categories = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  }
);
