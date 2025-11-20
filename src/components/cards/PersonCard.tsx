import React from "react";
import Thumbnail from "../ui/Thumbnail";

export type Person = {
  name: string;
  url?: string;
  gender?: string;
  birth_year?: string;
  height?: string;
  mass?: string;
};

type Props = {
  person: Person;
};

export const PersonCard: React.FC<Props> = ({ person }) => {
  return (
    <article className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="p-0">
        <Thumbnail
          resource="people"
          item={person}
          className="block"
          size="md"
        />
      </div>

      <div className="p-4">
        <h4 className="text-lg font-semibold leading-tight">{person.name}</h4>
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <div>
            Birth:{" "}
            <span className="text-gray-200">{person.birth_year ?? "—"}</span>
          </div>
          <div>
            Gender:{" "}
            <span className="text-gray-200">{person.gender ?? "—"}</span>
          </div>
          <div>
            Height:{" "}
            <span className="text-gray-200">{person.height ?? "—"}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PersonCard;
