import { component$, useSignal, $ } from "@builder.io/qwik";
import type { Models } from "appwrite";
import { AppwriteService } from "~/AppwriteService";

export default component$(
  (props: {
    account: undefined | null | true | Models.User<any>;
    isCsr: boolean;
  }) => {
    const account = useSignal<undefined | null | true | Models.User<any>>(
      props.account
    );

    const fetchAccount = $(async () => {
      account.value = true;

      try {
        account.value = await AppwriteService.getAccount();
      } catch (err: any) {
        account.value = null;
      }
    });

    let statusElement;

    if (account.value === undefined) {
      statusElement = <> Not Fetched Yet.</>;
    } else if (account.value === null) {
      statusElement = <>You are not signed in.</>;
    } else if (account.value === true) {
      statusElement = <>Fetching Account...</>;
    } else {
      statusElement = (
        <>
          Welcome{" "}
          <code class="u-un-break-text inline-code">{account.value.$id}</code>
        </>
      );
    }

    return (
      <div
        class={`card ${
          account.value === undefined || account.value === true
            ? "card-is-pending"
            : account.value === null
            ? "card-is-failed"
            : "card-is-complete"
        }`}
      >
        <div class="u-flex u-main-space-between u-cross-center">
          <div class="">
            <div class="eyebrow-heading-3">
              {props.isCsr ? "Client" : "Server"} Side
            </div>
          </div>

          <div
            style={{
              opacity: props.isCsr ? "100%" : "0%",
            }}
          >
            <div class="status">
              <button onClick$={fetchAccount} class="tag">
                <span class="text">Fetch</span>
              </button>
            </div>
          </div>
        </div>

        <h2 class="heading-level-6 u-margin-block-start-2">{statusElement}</h2>

        <div class="u-flex u-main-space-between u-cross-end u-margin-block-start-40">
          {account.value === undefined ||
          account.value === true ||
          account.value === null ? (
            <div
              style="--p-avatar-border-color: var(--color-neutral-120)"
              class="avatar is-color-empty"
            />
          ) : (
            <div class="avatar">
              <img
                src={AppwriteService.getAccountPicture(account.value.$id)}
                alt="Avatar"
              />
            </div>
          )}
          <div
            class={`status ${
              account.value === undefined || account.value === true
                ? "is-pending"
                : account.value === null
                ? "is-failed"
                : "is-complete"
            }`}
          >
            <span class="status-icon" />
          </div>
        </div>
      </div>
    );
  }
);
