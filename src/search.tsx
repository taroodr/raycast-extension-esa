import { ActionPanel, Detail, List, Action, showToast, Toast } from "@raycast/api";
import { useSearch } from "./hooks/useSearch";

export default function Command() {
  const { data, setSearchText, error } = useSearch();

  if (error) {
    showToast({ style: Toast.Style.Failure, title: "error has occurred", message: error.message });
  }

  return (
    <List
      onSearchTextChange={(text: string) => {
        setSearchText(text);
      }}
      searchBarPlaceholder="Search posts..."
      isLoading={data == null || error}
    >
      {data?.posts?.map((post) => (
        <List.Item
          icon="list-icon.png"
          key={post.number}
          title={post.name}
          subtitle={post.full_name}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                url={post.url}
                icon="link-icon.png"
                shortcut={{
                  key: "o",
                  modifiers: ["cmd"],
                }}
              />
              <Action.Push
                title="Show Details"
                shortcut={{
                  key: "d",
                  modifiers: ["cmd"],
                }}
                target={<Detail markdown={post.body_md} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
