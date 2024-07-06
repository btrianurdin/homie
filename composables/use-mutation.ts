interface UseMutationOptions<R> {
  onSuccess?: (data: R) => void;
  onError?: (error: unknown) => void;
}

const useMutation = <TData, TResult>(
  fn: (payload: TData) => Promise<TResult>,
) => {
  const _loading = ref(false);
  const _error = ref<unknown | null>(null);
  const _variable = ref<TData | null>(null);

  const mutate = (payload: TData, opts?: UseMutationOptions<TResult>): void => {
    _loading.value = true;
    _variable.value = payload as any;

    fn(payload)
      .then((res) => {
        opts?.onSuccess && opts.onSuccess(res);
      })
      .catch((error) => {
        _error.value = error;
        opts?.onError && opts.onError(error);
      })
      .finally(() => {
        _loading.value = false;
      });
  };

  return { loading: _loading, error: _error, variable: _variable, mutate };
};

export default useMutation;
