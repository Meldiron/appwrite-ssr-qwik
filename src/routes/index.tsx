import { component$, $, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { AppwriteProject, AppwriteService } from "~/AppwriteService";
import Card from "~/components/Card";

export const useAccountLoader = routeLoader$(async ({ cookie }) => {
  const sessionNames = [
    "a_session_" + AppwriteProject.toLowerCase(),
    "a_session_" + AppwriteProject.toLowerCase() + "_legacy",
  ];

  const hash =
    cookie.get(sessionNames[0])?.value ??
    cookie.get(sessionNames[1])?.value ??
    "";
  AppwriteService.setSession(hash);

  let account;
  try {
    account = await AppwriteService.getAccount();
  } catch (err) {
    console.log(err);
    account = null;
  }

  return {
    account
  };
});

export default component$(() => {
  const account = useAccountLoader();

  console.log(account.value);

  const isLoading = useSignal(false);
  const modalMessage = useSignal("");
  const modalType = useSignal("");

  const onCreateSession = $(async () => {
    const dialog: any = document.getElementById("dialog");

    isLoading.value = true;
    try {
      await fetch("/login", {
        method: "POST",
        body: "",
      });

      modalType.value = "success";
      modalMessage.value =
        "Session created! Refresh page to run SSR check, or re-fetch to run CSR cehck.";
      dialog.showModal();
    } catch (err: any) {
      modalType.value = "error";
      modalMessage.value = err.message;
      dialog.showModal();
    } finally {
      isLoading.value = false;
    }
  });

  const onDeleteSession = $(async () => {
    const dialog: any = document.getElementById("dialog");

    isLoading.value = true;
    try {
      await AppwriteService.signOut();

      modalType.value = "success";
      modalMessage.value =
        "Session deleted! Refresh page to run SSR check, or re-fetch to run CSR cehck.";
      dialog.showModal();
    } catch (err: any) {
      modalType.value = "error";
      modalMessage.value = err.message;
      dialog.showModal();
    } finally {
      isLoading.value = false;
    }
  });

  const closeModal = $(() => {
    const dialog: any = document.getElementById("dialog");

    modalMessage.value = "";
    modalType.value = "";
    dialog.close();
  });
  return (
    <>
      <main class="main-content">
        <div class="top-cover u-padding-block-end-56">
          <div class="container">
            <div class="u-flex u-gap-16 u-flex-justify-center u-margin-block-start-16">
              <h1 class="heading-level-1">Appwrite Loves Qwik</h1>
              <code class="u-un-break-text" />
            </div>
            <p
              class="body-text-1 u-normal u-margin-block-start-8"
              style="max-width: 50rem;"
            >
              This is demo application. Use button below to create account.
              Notice both server-side rendering, and client-side requests are
              authorized. The whole process uses 1st party secure cookies.
            </p>
          </div>
        </div>
        <div class="container u-margin-block-start-negative-56">
          <ul
            class="grid-box"
            style="--grid-gap:2rem; --grid-item-size:24rem; --grid-item-size-small-screens:16rem;"
          >
            <li>
              <Card isCsr={false} account={account.value.account} />
            </li>
            <li>
              <Card isCsr={true} account={undefined} />
            </li>
          </ul>
        </div>
        <div class="container">
          <div class="gradient-border">
            <article
              class="card u-grid u-cross-center u-width-full-line common-section"
              style="
    background: linear-gradient(180deg, hsl(var(--p-card-bg-color)) 0%, hsl(var(--p-card-bg-color)) 12%, hsl(var(--p-body-bg-color)) 100%);
    border: none;
"
            >
              <div class="u-flex u-flex-vertical u-cross-center u-gap-32 u-margin-block-start-40 u-padding-block-end-56">
                <div class="u-text-center">
                  <h2 class="heading-level-3">Manage Authorization</h2>
                  <p class="body-text-2 u-bold u-margin-block-start-8">
                    This component is not aware of auth status.
                  </p>
                </div>
                <div class="u-flex u-gap-16 u-main-center u-flex-vertical-mobile u-cross-center">
                  {isLoading.value ? (
                    <div class="loader" />
                  ) : (
                    <>
                      <form preventdefault:submit onSubmit$={onCreateSession}>
                        <button class="button" type="submit">
                          Create Anonymous Account
                        </button>
                      </form>

                      <form preventdefault:submit onSubmit$={onDeleteSession}>
                        <button class="button is-secondary" type="submit">
                          Sign Out
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </article>
          </div>
          <div class="u-margin-block-end-50" />
        </div>
      </main>

      <div>
        <dialog class="modal is-small" id="dialog">
          <form class="modal-form" method="dialog">
            <header
              class="modal-header u-flex u-gap-12 u-cross-center"
              style="flex-direction: row;"
            >
              {modalType.value === "error" ? (
                <>
                  <div class="avatar is-color-orange is-medium">
                    <span class="icon-exclamation" aria-hidden="true" />
                  </div>
                  <h4 class="modal-title heading-level-5">Error 🚨</h4>
                </>
              ) : (
                <>
                  <div class="avatar is-color-green is-medium">
                    <span class="icon-check" aria-hidden="true" />
                  </div>
                  <h4 class="modal-title heading-level-5">Success 🎉</h4>
                </>
              )}
            </header>
            <div class="modal-content u-small">{modalMessage.value}</div>
            <div class="modal-footer">
              <div class="u-flex u-main-end u-gap-16">
                <button onClick$={closeModal} class="button is-secondary">
                  <span class="text">Close</span>
                </button>
              </div>
            </div>
          </form>
        </dialog>
      </div>
    </>
  );
});
