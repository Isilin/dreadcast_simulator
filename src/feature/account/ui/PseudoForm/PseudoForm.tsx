import { useId, useState, type FormEvent } from 'react';

import styles from './PseudoForm.module.css';
import { PSEUDO_MAX_LENGTH, validatePseudo } from '../../model';
import { useCreatePseudo } from '../../services';

interface PseudoFormProps {
  onCreated?: (pseudo: string) => void;
  submitLabel?: string;
}

/**
 * Pseudo creation form. The pseudo is definitive: the form says so before
 * submitting.
 */
export const PseudoForm = ({
  onCreated,
  submitLabel = 'Enregistrer mon pseudo',
}: PseudoFormProps) => {
  const inputId = useId();
  const [pseudo, setPseudo] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const createPseudo = useCreatePseudo();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validatePseudo(pseudo);
    setValidationError(error);
    if (error) {
      return;
    }

    createPseudo.mutate(pseudo.trim(), {
      onSuccess: (profile) => {
        if (profile.pseudo) {
          onCreated?.(profile.pseudo);
        }
      },
    });
  };

  const serverError = createPseudo.isError ? createPseudo.error.message : null;
  const errorMessage = validationError ?? serverError;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.hint}>
        Votre pseudo apparaît sur vos publications et vos avis dans la
        Communauté. <strong>Il est définitif</strong> : choisissez-le avec soin.
      </p>
      <label htmlFor={inputId} className={styles.label}>
        Pseudo
      </label>
      <input
        id={inputId}
        className={styles.input}
        value={pseudo}
        maxLength={PSEUDO_MAX_LENGTH}
        autoComplete="nickname"
        aria-invalid={errorMessage !== null}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        onChange={(event) => {
          setPseudo(event.target.value);
          setValidationError(null);
        }}
      />
      {errorMessage ? (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        className={styles.submit}
        disabled={createPseudo.isPending}
      >
        {createPseudo.isPending ? 'Enregistrement...' : submitLabel}
      </button>
    </form>
  );
};
