import { of } from "rxjs";
import { catchError, flatMap, mapTo, startWith } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { useEventCallback } from "rxjs-hooks";

export function useInstanceUpdate(id, action) {
    const [updateInstance, updated] = useEventCallback(
        event$ =>
            event$.pipe(
                flatMap(() =>
                    ajax({
                        url: `/instance/${action}?id=` + encodeURIComponent(id),
                        method: "POST",
                    }).pipe(
                        mapTo(true),
                        catchError(e => {
                            console.error("Can't access instance", id, e);
                            return of(false);
                        }),
                        startWith(true)
                    )
                )
            ),
        false
    );

    return [updated, () => updateInstance(id, action)];
}